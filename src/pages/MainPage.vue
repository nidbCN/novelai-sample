<template>
  <v-container>
    <v-row>
      <v-col cols="8">
        <v-container>
          <v-row class="my-4">
            <v-card width="100%">
              <v-card-title>设置</v-card-title>
              <v-card-text>
                <v-container>
                  <v-form>
                    <v-row class="mx-16">
                      <v-col cols="12">
                        <v-text-field
                            v-model="backend.url"
                            label="后端地址"
                            required
                        ></v-text-field>
                      </v-col>
                    </v-row>
                    <v-row class="mx-16">
                      <v-col cols="4">
                        <v-text-field
                            v-model="backend.payload.width"
                            :counter="4"
                            label="宽度"
                            required
                        ></v-text-field>
                      </v-col>
                      <v-col cols="4">
                        <v-text-field
                            v-model="backend.payload.height"
                            :counter="4"
                            label="高度"
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
                    <v-row class="mx-16">
                      <v-col cols="12">
                        <v-textarea
                            v-model="backend.payload.prompt"
                            rows="5"
                            label="标签"
                        >
                        </v-textarea>
                      </v-col>
                    </v-row>
                    <v-row class="mx-16">
                      <v-col cols="12">
                        <v-textarea
                            v-model="backend.payload.uc"
                            rows="3"
                            label="负面标签"
                        >
                        </v-textarea>
                      </v-col>
                    </v-row>
                    <v-row class="mx-16">
                      <v-col cols="4">
                        <v-text-field
                            v-model="backend.payload.step"
                            label="step"
                        >
                        </v-text-field>
                      </v-col>
                      <v-col cols="4">
                        <v-text-field
                            v-model="backend.payload.scale"
                            label="scale"
                        >
                        </v-text-field>
                      </v-col>
                      <v-col cols="4">
                        <v-text-field
                            v-model="backend.payload.n_samples"
                            label="张数"
                        >
                        </v-text-field>
                      </v-col>
                    </v-row>
                  </v-form>
                </v-container>
              </v-card-text>
            </v-card>
          </v-row>
        </v-container>
      </v-col>
      <v-col cols="4">
        <v-container>
          <v-row class="my-4">
            <v-card width="100%">
              <v-card-actions>
                <v-btn color="primary" @click="generate" :loading="status.requestLock">
                  <v-icon>mdi-cloud-download</v-icon>
                  生成图片
                </v-btn>
                <v-btn color="error" @click="clearPicture">
                  <v-icon>mdi-delete-empty</v-icon>
                  清空图片
                </v-btn>
                <v-btn color="success" @click="clearPicture">
                  <v-icon>mdi-content-save</v-icon>
                  保存全部
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-row>
          <v-row class="my-4">
            <v-card width="100%" height="370px">
              <v-card-title>图像</v-card-title>
              <v-card-text>
                <v-card
                    max-height="300px"
                    flat
                    tile
                    class="overflow-y-auto"
                >
                  <v-list-item v-for="(item, key) in status.images" :key="key">
                    <v-list-item-content>
                      <img alt="image result" class="my-2" style="max-height: 260px; object-fit: contain" :src="item"/>
                    </v-list-item-content>
                  </v-list-item>
                </v-card>
              </v-card-text>
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

  data: () => ({
    backend: {
      url: 'http://localhost:8000/',
      payload: {
        prompt: "masterpiece, best quality, 1girl, cute, school uniform, outside",
        uc: "lowres, bad anatomy, bad hands, text, error, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality, normal quality, jpeg artifacts, signature, watermark, username, blurry",
        seed: 114514,
        n_samples: 1,
        sampler: "k_euler_ancestral",
        width: 288,
        height: 512,
        scale: 8,
        step: 22
      }
    },
    options: {
      sampler: ['plms', 'ddim', 'k_euler', 'k_euler_ancestral', 'k_heun', 'k_dpm_2', 'k_dpm_2_ancestral', 'k_lms'],
    },
    status: {
      images: [],
      requestLock: false,
    }
  }),
  mounted() {
    this.backend = config.default.backend;
  },
  methods: {
    generate: function () {
      this.status.requestLock = true;
      if (!this.backend.url.endsWith('/')) {
        this.backend.url = this.backend.url + '/';
      }

      this.backend.payload.seed = parseInt(Math.random() * 10000, 10);

      axios.post(this.backend.url + 'generate', this.backend.payload)
          .then(response => {
            if (response['status'] !== 200 || !response['data'] || !response['data']['output']) {
              // error
              alert("非200的返回值，可能是出错了");
            } else {
              const outputList = response['data']['output'];
              outputList.forEach(str => {
                this.status.images.unshift("data:image/png;base64," + str);
              });
            }
            this.status.requestLock = false;
          })
          .catch(error => {
            alert("由于某些原因无法连接后端（通常是由于显存不足），请等待数分钟后端重启。");
            console.log(error);
          })
    },
    clearPicture: function () {
      this.status.images.splice(0, this.status.images.length);
    }
  }
}
</script>
