<template>
  <v-container>
    <CoolLightBox
        :items="status.imageList"
        :index="status.imageIndex"
        @close="status.imageIndex = null">
    </CoolLightBox>
    <v-row>
      <v-col cols="7">
        <v-container>
          <v-row class="my-4">
            <v-card width="100%">
              <v-card-title>设置</v-card-title>
              <v-card-text>
                <v-form>
                  <v-row>
                    <v-col cols="8">
                      <v-text-field
                          v-model="backend.url"
                          label="后端地址"
                          required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="4">
                      <v-select
                          :items="options.sampler"
                          v-model="backend.payload.sampler"
                          label="采样方法"
                      ></v-select>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="6">
                      <v-slider
                          v-model="backend.payload.width"
                          label="宽度"
                          step="64"
                          min="64"
                          max="1024"
                          thumb-label="always"
                      ></v-slider>
                    </v-col>
                    <v-col cols="6">
                      <v-slider
                          v-model="backend.payload.height"
                          label="高度"
                          step="64"
                          min="64"
                          max="1024"
                          thumb-label="always"
                      ></v-slider>
                    </v-col>

                  </v-row>
                  <v-row>
                    <v-col cols="12">
                      <v-textarea
                          clearable
                          v-model="backend.payload.prompt"
                          rows="5"
                          label="标签(prompt)"
                      >
                      </v-textarea>
                      <v-switch
                          v-model="options.autoPrompt"
                          label="自动添加官方前端预设 prompt"
                      ></v-switch>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12">
                      <v-textarea
                          clearable
                          v-model="backend.payload.uc"
                          rows="3"
                          label="负面标签(negative prompt)"
                      >
                      </v-textarea>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="6">
                      <v-slider
                          v-model="backend.payload.steps"
                          label="steps"
                          step="1"
                          min="0"
                          max="50"
                          thumb-label
                      ></v-slider>
                    </v-col>
                    <v-col cols="6">
                      <v-slider
                          v-model="backend.payload.scale"
                          label="scale"
                          step="1"
                          min="0"
                          max="30"
                          thumb-label
                      ></v-slider>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="4">
                      <v-text-field
                          prepend-icon="mdi-dice-3"
                          v-model="backend.payload.seed"
                          append-icon="mdi-refresh"
                          :disabled="options.autoSeed"
                          @click:append="backend.payload.seed = getSeed()"
                          label="种子"
                      >
                      </v-text-field>
                    </v-col>
                    <v-col cols="4">
                      <v-switch
                          v-model="options.autoSeed"
                          label="自动生成"
                      ></v-switch>
                    </v-col>

                    <v-col cols="4">
                      <v-text-field
                          v-model="backend.payload.n_samples"
                          label="张数(batch size)"
                      >
                      </v-text-field>
                    </v-col>
                  </v-row>
                </v-form>
              </v-card-text>
            </v-card>
          </v-row>
        </v-container>
      </v-col>
      <v-col cols="5">
        <v-container>
          <v-row class="my-4">
            <v-card width="100%">
              <v-card-actions>
                <v-btn color="primary" @click="generateImage" :loading="status.requestLock">
                  <v-icon>mdi-cloud-download</v-icon>
                  生成图片
                </v-btn>
                <v-btn color="error" @click="removeAllImage">
                  <v-icon>mdi-delete-empty</v-icon>
                  清空图片
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-row>
          <v-row class="my-4">
            <v-card width="100%" height="370px">
              <v-card-title>图像</v-card-title>

              <v-card
                  max-height="300px"
                  flat
                  tile
                  class="overflow-y-auto"
              >
                <v-container v-for="(item, key) in status.imageList" :key="key">
                  <v-card tile>
                    <v-img @click="status.imageIndex = key"
                           width="100%" max-height="200px"
                           contain :src="item.src"></v-img>

                    <v-card-text class="cyan lighten-5">
                      <v-btn color="success" small icon @click="saveImage(key)">
                        <v-icon>mdi-content-save</v-icon>
                      </v-btn>
                      <v-btn color="error" small icon @click="removeImage(key)">
                        <v-icon>mdi-delete</v-icon>
                      </v-btn>

                      <span class="float-right"><code>{{ item.title }}</code></span>
                    </v-card-text>
                  </v-card>
                </v-container>
              </v-card>

            </v-card>
          </v-row>

          <v-row class="my-4">
            <v-card width="100%" height="260px">
              <v-card-title>请求</v-card-title>
              <v-card-text>
                <v-card
                    dark
                    flat
                    tile
                    max-height="180px"
                    class="overflow-y-auto"
                >
                  <v-window :dark="true">
                    <v-window-item class="overflow-visible overflow-x-auto">
                      <pre class="ma-4">{{ JSON.stringify(backend.payload, null, 2) }}</pre>
                    </v-window-item>
                  </v-window>
                </v-card>
              </v-card-text>
            </v-card>
          </v-row>
        </v-container>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from 'axios';
import config from "@/config";

export default {
  name: 'MainPage',
  mounted() {
    this.backend = config.default.backend;

    if (this.$route.query['backend_url']) {
      this.backend.url = this.$route.query['backend_url'];
    }
  },
  data: () => ({
    backend: {
      url: 'http://localhost:8000/',
      payload: {
        prompt: "1girl, cute, school uniform, outside",
        uc: "lowres, bad anatomy, bad hands, text, error, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality, normal quality, jpeg artifacts, signature, watermark, username, blurry",
        seed: 114514,
        n_samples: 1,
        sampler: "k_euler_ancestral",
        width: 384,
        height: 576,
        scale: 8,
        steps: 22
      }
    },
    options: {
      sampler: ['plms', 'ddim', 'k_euler', 'k_euler_ancestral', 'k_heun', 'k_dpm_2', 'k_dpm_2_ancestral', 'k_lms'],
      autoSeed: true,
      autoPrompt: true,
    },
    status: {
      imageList: [],
      imageIndex: null,
      requestLock: false,
    }
  }),
  methods: {
    generateImage: function () {
      this.status.requestLock = true;
      if (!this.backend.url.endsWith('/')) {
        this.backend.url = this.backend.url + '/';
      }

      // copy payload
      const payload = {};
      for (const key in this.backend.payload) {
        payload[key] = this.backend.payload[key];
      }

      if (this.options.autoPrompt) {
        payload['prompt'] = "masterpiece, best quality, " + payload['prompt'];
      }

      axios.post(this.backend.url + 'generate', payload)
          .then(response => {
            if (response['status'] !== 200 || response['data']['error']) {
              // http error
              alert("非200的返回值，可能是出错了\n" + response['data']['error']);
            } else {
              // request complete
              const outputList = response['data']['output'];

              outputList.forEach(str => {
                this.status.imageList.unshift({
                  src: "data:image/png;base64," + str,
                  title: 'seed: ' + this.backend.payload.seed
                });
              });

              // re-generate seed
              if (this.options.autoSeed) {
                this.backend.payload.seed = this.getSeed();
              }
            }

            // unlock
            this.status.requestLock = false;
          })
          .catch(error => {
            alert("由于某些原因无法连接后端（通常是由于显存不足），请等待数分钟后端重启\n" + error['message']);

            // unlock
            this.status.requestLock = false;
          })
    },
    removeAllImage: function () {
      this.status.imageList.splice(0, this.status.imageList.length);
    },
    removeImage: function (index) {
      this.status.imageList.splice(index, 1);
    },
    saveImage: function (index) {
      const linkElement = document.createElement('a');
      const imageItem = this.status.imageList[index];

      linkElement.href = imageItem['src'];
      linkElement.download = 'image-' + imageItem['seed'] + '.png';

      linkElement.click();
    },
    getSeed: function () {
      // not lager than 2^32 -1
      return Math.floor(Math.random() * 2147483648);
    }
  }
}
</script>
