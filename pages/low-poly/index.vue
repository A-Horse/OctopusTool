<template>
  <section class="container">
    <div>
      <div>
        <a id="upload">上传图片</a>
        <input type="file" id="files" v-on:change="onChange" accept="image/*"/>
      </div>
      <div v-if="!!img">
        <div>
          <label>accuracy</label>
          <span>{{jxd}}</span>
          <input type="range" min="2" v-model="jxd" v-on:change="parse">
        </div>

        <div>
          <label>random point</label>
          <span>{{random}}</span>
          <input type="range" max="1000" v-model="random" v-on:change="parse">
        </div>
      </div>

      <div class="canvas-container" v-bind:class="{ 'running': running }">
        <canvas></canvas>
      </div>

      <div>
        <a class="download-link" v-on:click="download">Download</a>
      </div>
    </div>
  </section>
</template>

<script>
import LowPolyWorker from '../../worker/low-poly.worker.js'

export default {
  components: {
  },
  data () {
    return {
      jxd: 50,
      random: 100,
      img: null,
      running: false,
      worker: null
    }
  },
  methods: {
    download () {
      const link = this.$el.querySelector('.download-link')
      link.href = this.$el.querySelector('canvas').toDataURL()
      link.download = '_lowpolyify'
    },
    onChange (event) {
      const input = event.target
      if (!input.files.length) return
      var file = input.files[0]
      if (!/\/(?:jpeg|png)/i.test(file.type)) {
        alert('图片需为JPG或者PNG格式')
        return
      }
      const self = this
      var reader = new FileReader()
      reader.onload = function () {
        var img = new Image()
        img.src = this.result

        img.onload = function () {
          self.img = this
          self.parse()
        }
      }
      reader.readAsDataURL(file)
    },
    parse () {
      if (!this.img) {
        return
      }
      if (this.running) {
        this.worker.terminate()
      }

      this.running = true
      const img = this.img
      const jxdvalue = this.jxd
      const canvas = this.$el.querySelector('canvas')
      const ctx = canvas.getContext('2d')

      canvas.width = img.width
      canvas.height = img.height * canvas.width / img.width
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

      this.worker = new LowPolyWorker()

      setTimeout(() => {
        var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height)

        this.worker.postMessage({
          imgData: imgData,
          width: canvas.width,
          height: canvas.height,
          jxdvalue
        })

        this.worker.addEventListener('message', ({ data }) => {
          if (data.finish) {
            this.running = false
            return
          }
          const { x1, x2, x3, y1, y2, y3, colorr, colorg, colorb } = data
          ctx.save()
          ctx.beginPath()
          ctx.moveTo(x1, y1)
          ctx.lineTo(x2, y2)
          ctx.lineTo(x3, y3)
          ctx.closePath()
          ctx.fillStyle = 'rgba(' + colorr + ',' + colorg + ',' + colorb + ',1)'
          ctx.fill()
          ctx.restore()
        })
      }, 50)
    }
  }
}
</script>

<style scoped>
.container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.canvas-container {
  position: relative;
}

.canvas-container.running {
  opacity: 0.5;
}

.canvas-container.running:before {
  content: '';
  display: block;
  position: absolute;
  z-index: 50;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  background-color: black;
  opacity: 0.3;
}

.index-link {

}
</style>
