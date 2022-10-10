export default {
    default: {
        backend: {
            url: "http://localhost:8000",
            payload: {
                prompt: "1girl, cute, school uniform, outside",
                uc: "lowres, bad anatomy, bad hands, text, error, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality, normal quality, jpeg artifacts, signature, watermark, username, blurry",
                seed: 114514,
                n_samples: 1,
                sampler: "k_euler_ancestral",
                width: 512,
                height: 768,
                scale: 8,
                steps: 22
            }
        },
        website: {
            barTitle: "Novel AI frontend",
            links: [
                {
                    icon: "mdi-github",
                    text: "Github",
                    link: "https://github.com/nidbCN/novelai-sample"
                }
            ]
        }
    },
}
