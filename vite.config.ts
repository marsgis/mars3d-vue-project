import path from "path"
import { readFileSync } from "fs"
import type { ConfigEnv } from "vite"
import { defineConfig, loadEnv } from "vite" // 帮手函数，这样不用 jsdoc 注解也可以获取类型提示
import vue from "@vitejs/plugin-vue"
import eslintPlugin from "vite-plugin-eslint"
import { mars3dPlugin } from "vite-plugin-mars3d"

import { createStyleImportPlugin, AndDesignVueResolve } from "vite-plugin-style-import"

// 兼容两套工具链：vite 8+（rolldown 内核，分包配置为 output.codeSplitting）
// 与 vite 7 及以下（rollup 内核，使用 output.manualChunks）。按实际安装的 vite 主版本切换。
function detectRolldown(): boolean {
  try {
    const pkg = JSON.parse(readFileSync(new URL("./node_modules/vite/package.json", import.meta.url), "utf-8"))
    return Number(String(pkg.version).split(".")[0]) >= 8
  } catch {
    return false
  }
}
// cesium/mars3d/echarts 分包匹配规则（两内核共用同一套判断，注意 cesium 优先级必须高于 mars3d）
function manualChunkGroups(id: string): string | void {
  if (/[\\/]node_modules[\\/]mars3d-cesium[\\/]/.test(id)) { return "cesium" }
  if (/[\\/]node_modules[\\/]mars3d(-[a-z]+)*[\\/]|[\\/]packages[\\/]mars3d[\\/]/.test(id)) { return "mars3d" }
  if (/[\\/]node_modules[\\/](echarts|zrender)[\\/]/.test(id)) { return "echarts" }
  if (id.includes("node_modules")) { return "vendor" }
}

export default ({ mode }: ConfigEnv) => {
  const root = process.cwd()
  // 获取 .env 文件里定义的环境变量
  const ENV = loadEnv(mode, root)

  console.log(`当前环境信息：`, mode)
  console.log(`ENV：`, ENV)

  const isRolldown = detectRolldown()

  return defineConfig({
    base: ENV.VITE_BASE_URL,
    server: {
      host: "localhost",
      port: 3002
    },
    define: {
      "process.env": {
        mode,
        BASE_URL: ENV.VITE_BASE_URL,
        API_BASE: ENV.VITE_API_URL,
        API_LOCAL: ENV.VITE_LOCAL_API
      },
      buildTime: JSON.stringify(new Date().toLocaleString())
    },
    resolve: {
      alias: {
        "@mars": path.join(import.meta.dirname, "src")
      },
      extensions: [".js", ".ts", ".jsx", ".tsx", ".json"]
    },
    optimizeDeps: {
      include: ["kml-geojson"]
    },
    json: {
      // 支持从 .json 文件中进行按名导入
      namedExports: true,
      stringify: false
    },
    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
          additionalData: `@import "${path.resolve(import.meta.dirname, "src/components/mars-ui/base.less")}";`
        }
      }
    },
    build: {
      // 输出路径
      outDir: path.join("./dist", ENV.VITE_BASE_URL),
      // 小于此阈值的导入或引用资源将内联为 base64 编码， 以避免额外的http请求， 设置为 0, 可以完全禁用此项，
      assetsInlineLimit: 4096,
      // 启动 / 禁用 CSS 代码拆分
      cssCodeSplit: true,
      // 构建后是否生成 soutrce map 文件
      sourcemap: false,
      // 自定义rollup-commonjs插件选项
      commonjsOptions: {
        include: /node_modules|packages/
      },
      // 静态资源目录
      assetsDir: "assets",
      // 自定义底层的 Rollup 打包配置
      rollupOptions: {
        input: {
          index: path.resolve(import.meta.dirname, "index.html"),
        },
        output: {
          chunkFileNames: "assets/js/[name]-[hash].js",
          entryFileNames: "assets/js/[name]-[hash].js",
          assetFileNames: "assets/[ext]/[name]-[hash].[ext]",
          // 将超大第三方库拆分为独立 chunk，提升浏览器缓存命中与并行加载。
          // rolldown(vite8+) 用 codeSplitting.groups；rollup(vite7-) 用 manualChunks 函数
          ...(isRolldown
            ? {
                codeSplitting: {
                  groups: [
                    // cesium 内核，单库即超 10MB，必须独立成 chunk
                    { name: "cesium", test: /[\\/]node_modules[\\/]mars3d-cesium[\\/]/, priority: 30 },
                    // mars3d 主库及各插件（优先级需低于 cesium，避免误匹配 mars3d-cesium）
                    { name: "mars3d", test: /[\\/]node_modules[\\/]mars3d(-[a-z]+)*[\\/]|[\\/]packages[\\/]mars3d[\\/]/, priority: 20 },
                    { name: "echarts", test: /[\\/]node_modules[\\/](echarts|zrender)[\\/]/, priority: 10 },
                    // 其余 node_modules 依赖统一进 vendor
                    { name: "vendor", test: /[\\/]node_modules[\\/]/, priority: 0 }
                  ]
                }
              }
            : {
                manualChunks: manualChunkGroups
              })
        }
      },
      // 当设置为 true, 构建后将会生成 manifest.json 文件
      manifest: false,
      // 设置为 false 可以禁用最小化混淆,或是用来指定是应用哪种混淆器 boolean | 'terser' | 'esbuild'
      minify: "terser",
      // 传递给 Terser 的更多 minify 选项
      terserOptions: {
        compress: {
          drop_console: true, // 生产环境移除 console.log（业务日志请用受 devProject 开关控制的 logInfo/logWarn）
          drop_debugger: true // 在生产环境移除debugger
        }
      },
      // 设置为false 来禁用将构建好的文件写入磁盘
      write: true,
      // 默认情况下 若 outDir 在 root 目录下， 则 Vite 会在构建时清空该目录。
      emptyOutDir: true
    },
    plugins: [
      vue(),
      eslintPlugin(),
      // Vite 8(rolldown) 预构建 mars3d-cesium 会挂起导致 dev 卡死，必须走静态资源外链模式
      mars3dPlugin({ useStatic: true, chunkSizeWarningLimit: 12000 }),
      createStyleImportPlugin({
        resolves: [AndDesignVueResolve()],
        libs: [
          {
            libraryName: "ant-design-vue",
            esModule: true,
            resolveStyle: (name) => {
              if (name === "auto-complete") {
                return `ant-design-vue/es/${name}/index`
              }
              return `ant-design-vue/es/${name}/style/index`
            }
          }
        ]
      })
    ]
  })
}
