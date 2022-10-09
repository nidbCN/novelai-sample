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
                      <v-col cols="3">
                        <v-text-field
                            v-model="backend.payload.width"
                            :counter="4"
                            label="宽度"
                            required
                        ></v-text-field>
                      </v-col>
                      <v-col cols="3">
                        <v-text-field
                            v-model="backend.payload.height"
                            :counter="4"
                            label="高度"
                            required
                        ></v-text-field>
                      </v-col>
                      <v-col cols="6">
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
                      <v-col cols="3">
                        <v-text-field
                            v-model="backend.payload.step"
                            label="step"
                        >
                        </v-text-field>
                      </v-col>
                      <v-col cols="3">
                        <v-text-field
                            v-model="backend.payload.scale"
                            label="scale"
                        >
                        </v-text-field>
                      </v-col>
                      <v-col cols="3">
                        <v-text-field
                            v-model="backend.payload.seed"
                            append-icon="mdi-refresh"
                            @click:append="backend.payload.seed =  parseInt(Math.random() * 1000000, 10)"
                            label="种子"
                        >
                        </v-text-field>
                      </v-col>
                      <v-col cols="3">
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
              <v-card-text>
                <v-card
                    max-height="300px"
                    flat
                    tile
                    class="overflow-y-auto"
                >
                  <v-list>
                    <v-list-item two-line v-for="(item, key) in status.imageList" :key="key">
                      <v-list-item-content>
                        <img style="max-width: 220px; max-height: 240px;object-fit: contain"
                             alt="image result" :src="item.data"/>
                      </v-list-item-content>
                      <v-list-item-action>
                        <v-btn color="success" small icon @click="saveImage(key)">
                          <v-icon>mdi-content-save</v-icon>
                        </v-btn>
                      </v-list-item-action>
                      <v-list-item-action>
                        <v-btn color="error" small icon @click="removeImage(key)">
                          <v-icon>mdi-delete</v-icon>
                        </v-btn>
                      </v-list-item-action>
                    </v-list-item>
                  </v-list>
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
      imageList: [],
      requestLock: false,
    }
  }),
  mounted() {
    this.backend = config.default.backend;
  },
  methods: {
    generateImage: function () {
      this.status.requestLock = true;
      if (!this.backend.url.endsWith('/')) {
        this.backend.url = this.backend.url + '/';
      }

      axios.post(this.backend.url + 'generate', this.backend.payload)
          .then(response => {
            if (response['status'] !== 200 || response['data']['error']) {
              // http error
              alert("非200的返回值，可能是出错了\n" + response['data']['error']);
            } else {
              // request complete
              const outputList = response['data']['output'];

              outputList.forEach(str => {
                this.status.imageList.unshift({
                  data: "data:image/png;base64," + str,
                  seed: this.backend.payload.seed,
                });
              });

              // re-generate seed
              this.backend.payload.seed = parseInt(Math.random() * 1000000, 10);
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
    openImage: function (index) {
      const linkElement = document.createElement('a');

      linkElement.href = this.status.imageList[index]['data'];
      linkElement.target = "_blank";

      linkElement.click();
    },
    saveImage: function (index) {
      const linkElement = document.createElement('a');
      const imageData = this.status.imageList[index]['data'];

      linkElement.href = imageData;
      linkElement.download = 'image-' + imageData.substring(imageData.length - 6) + '.png';

      linkElement.click();
    }
  }
}
</script>
