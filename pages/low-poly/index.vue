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
import Delaunay from 'delaunay'
import { sobel } from '../../lib/sobel'
import MyWorker from '../../xx.worker.js'

export default {
  components: {
  },
  data () {
    return {
      jxd: 50,
      random: 100,
      img: null,
      running: false
    }
  },
  mounted () {
    console.log('1')
    let worker = new MyWorker()
    console.log('2')
    worker.onmessage = (event) => {
      console.log(event)
    }
    worker.addEventListener('message', function (event) {
      console.log(event, 'hihi')
    })
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
      this.running = true
      const img = this.img
      const jxdvalue = this.jxd
      const canvas = this.$el.querySelector('canvas')
      const ctx = canvas.getContext('2d')
      var particles = []
      canvas.width = img.width
      canvas.height = img.height * canvas.width / img.width
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

      setTimeout(() => {
        var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        //          收集色值大于40的边缘像素点
        var collectors = []

        sobel(imgData, function (value, x, y) {
          if (value > 40) {
            collectors.push([x, y])
          }
        })

        //          添加一些随机点
        for (var i = 0; i < this.random; i++) {
          particles.push([Math.random() * canvas.width, Math.random() * canvas.height])
        }
        //          添加随机边缘点，数量为边缘点数量除于50
        const length = ~~(collectors.length / jxdvalue)

        let random
        for (var l = 0; l < length; l++) {
          random = (Math.random() * collectors.length) << 0
          particles.push(collectors[random])
          collectors.splice(random, 1)
        }
        //          添加四顶点坐标
        particles.push([0, 0], [0, canvas.height], [canvas.width, 0], [canvas.width, canvas.height])
        //          使用delaunay三角化获取三角坐标
        let triangles = Delaunay.triangulate(particles)
        let x1, x2, x3, y1, y2, y3, cx, cy
        for (let i = 0; i < triangles.length; i += 3) {
          x1 = particles[triangles[i]][0]
          x2 = particles[triangles[i + 1]][0]
          x3 = particles[triangles[i + 2]][0]
          y1 = particles[triangles[i]][1]
          y2 = particles[triangles[i + 1]][1]
          y3 = particles[triangles[i + 2]][1]
          //              获取三角形中心点坐标
          cx = ~~((x1 + x2 + x3) / 3)
          cy = ~~((y1 + y2 + y3) / 3)
          //              获取中心点坐标的颜色值
          var index = (cy * imgData.width + cx) * 4
          var colorr = imgData.data[index]
          var colorg = imgData.data[index + 1]
          var colorb = imgData.data[index + 2]
          //              绘制三角形
          ctx.save()
          ctx.beginPath()
          ctx.moveTo(x1, y1)
          ctx.lineTo(x2, y2)
          ctx.lineTo(x3, y3)
          ctx.closePath()
          ctx.fillStyle = 'rgba(' + colorr + ',' + colorg + ',' + colorb + ',1)'
          ctx.fill()
          ctx.restore()
        }
        this.running = false
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
