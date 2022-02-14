import fs from "fs-extra"
import path from "path"
import serveStatic from "serve-static"
import { HtmlTagDescriptor, normalizePath, Plugin, UserConfig } from "vite"

interface VitePluginCesiumOptions {
  cesiumRunPath?: string
}

function vitePluginCesium(
  options: VitePluginCesiumOptions = {
    cesiumRunPath: "/cesium/"
  }
): Plugin {
  const { cesiumRunPath } = options
  const cesiumNpmPath = "node_modules/mars3d-cesium/Build/Cesium/"

  let outDir, base, CESIUM_BASE_URL
  let isBuild = false

  return {
    name: "vite-plugin-cesium",

    config(c, { command }) {
      isBuild = command === "build"
      if (c.base) {
        base = c.base
        if (base === "") {
          base = "./"
        }
      } else { base = "/" }

      if (c.build?.outDir) {
        outDir = c.build.outDir
      } else { outDir = "dist" }

      CESIUM_BASE_URL = path.posix.join(base, cesiumRunPath)

      const userConfig: UserConfig = {}
      if (!isBuild) {
        userConfig.optimizeDeps = {
          exclude: ["mars3d-cesium"]
        }
        userConfig.define = {
          CESIUM_BASE_URL: JSON.stringify(CESIUM_BASE_URL)
        }
      }
      return userConfig
    },

    configureServer({ middlewares }) {
      // const cesiumPath = path.join(cesiumNpmPath, "Cesium")
      const cesiumPath = cesiumNpmPath
      middlewares.use(CESIUM_BASE_URL, serveStatic(cesiumPath) as any)
    },

    async closeBundle() {
      if (isBuild) {
        try {
          await fs.copy(cesiumNpmPath, path.join(outDir, cesiumRunPath))
        } catch (err) {
          console.error("copy failed", err)
        }
      }
    },

    transformIndexHtml() {
      const tags: HtmlTagDescriptor[] = [
        { tag: "link", attrs: { rel: "stylesheet", href: normalizePath(path.join(CESIUM_BASE_URL, "Widgets/widgets.css")) } },
        { tag: "script", attrs: { src: normalizePath(path.join(CESIUM_BASE_URL, "Cesium.js")) } }
      ]
      return tags
    }
  }
}

export default vitePluginCesium
