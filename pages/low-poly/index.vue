<template>
  <section class="container">
    <div class="heading" v-bind:class="{ 'init': !img }">
      <h2>Low Poly</h2>
      <img alt="" src="~static/images/octopus.png"/>
    </div>
    <div>
      <h3>Low Poly Generator</h3>
      <p>Low Poly Generator an exciting method that gives web designers the scalability, flexibility, and performance to generate low poly image. Only a few simple steps to create a work of art. </p>
      <div>
        <h3>How I works:</h3>
        <ul>
          <li>Upload image (only png or jpg)</li>
          <li>I will generate low poly image immediately.</li>
          <li>You can adjust accuracy and random point slider to control the generated low poly effect.</li>
        </ul>
      </div>

      <div>
        <small>Sorry guys, it works only with browsers with Canvas API support.</small>
      </div>
    </div>
    <div>
      <label class="upload">
        upload image
        <input type="file" id="files" v-on:change="onChange" accept="image/*"/>
      </label>
    </div>
    <div v-if="!!img">
      <div class="slider">
        <label>accuracy</label>
        <span>{{jxd}}</span>
        <input type="range" min="2" max="100" v-model="jxd" v-on:change="parse">
      </div>

      <div class="slider">
        <label>random point</label>
        <span>{{random}}</span>
        <input type="range" max="1000" v-model="random" v-on:change="parse">
      </div>
    </div>

    <div class="canvas-container" v-bind:class="{ 'running': running }">
      <canvas></canvas>
    </div>

    <div v-if="!!img">
      <a class="download-link" v-on:click="download">Download</a>
    </div>
  </section>
</template>

<script>
import LowPolyWorker from '../../worker/low-poly.worker.js'

export default {
  head () {
    return {
      title: 'Generate low poly image',
      meta: [
        { hid: 'description', name: 'description', content: 'Generate low poly image with a click!' },
        { hid: 'og:title', name: 'og:title', content: 'Design Tool - Low poly image generation.' }
      ]
    }
  },
  components: {
  },
  data () {
    return {
      jxd: 50,
      random: 100,
      img: null,
      running: false,
      worker: null,
      fileName: 'low-poly'
    }
  },
  methods: {
    download () {
      const link = this.$el.querySelector('.download-link')
      link.href = this.$el.querySelector('canvas').toDataURL()
      link.download = 'lp_' + this.fileName
    },
    onChange (event) {
      const input = event.target
      if (!input.files.length) return
      var file = input.files[0]
      this.fileName = file.name
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
          setTimeout(() => {
            self.parse()
          })
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
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 0 20px 30px;
}

.heading {
  overflow: hidden;
  padding: 20px 0;
  background-color: #5fb084;
  color: white;
  font-size: 3rem;
  font-weight: 900;
  position: relative;
}

.heading.init {
  height: 380px;
}

.heading h2 {
  margin-left: -20rem;
}

.heading img {
  position: absolute;
  width: 100%;
  left: 0;
  bottom: 0;
  opacity: 0.5;
}

label.upload {
  margin-top: 20px;
  margin-bottom: 20px;
  display: inline-block;
  position: relative;
  border: 1px solid #999;
  border-radius: 3px;
  padding: 3px 5px 4px;
  cursor: pointer;
  transition: all 100ms;
  background-color: white;
}

label.upload * {
  cursor: pointer;
}

label.upload:hover {
  background-color: #5fb084;
  border: 1px solid #5fb084;
  color: white;
}

label.upload input {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 100;
  opacity: 0;
  height: 100%;
  width: 100%;
}

.slider {
  width: 300px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 auto;
}

.canvas-container {
  width: 100%;
  overflow: scroll;
  margin-top: 20px;
  position: relative;
  box-sizing: border-box;
}

canvas {
  display: block;
  margin: 0 auto;
  border-radius: 2px;
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
  opacity: 0.3;
}

.index-link {

}

.download-link {
  margin-top: 10px;
  display: inline-block;
}
</style>
