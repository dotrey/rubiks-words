import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import filesize from "rollup-plugin-filesize";
import {terser} from "rollup-plugin-terser";

export default {
    input: "built/main.js",
    output: {
      file: "rcw.js",
      format: "iife",
      name : "cube"
  },
  plugins: [
      nodeResolve({
          browser : true
      }),

      commonjs({
          include : "node_modules/**"
      }),
      
      terser(),

      filesize()
  ]
  };