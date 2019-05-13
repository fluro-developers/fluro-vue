<template>
        <div class="fluro-image" :class="{loaded:loaded}" :style="style">
            <div :style="spacer"></div>
            <!-- <transition name="fade"> -->
            <div class="placeholder" v-if="!loaded" :style="{backgroundImage:placeholderImage}"></div>
            <!-- </transition> -->
            <v-progress-circular v-if="!loaded && spinner" indeterminate color="rgba(180,180,180,0.5)"></v-progress-circular>
            <slot></slot>

        </div>
        <!-- <pre>{{url}}</pre> -->
</template>
<script>
export default {
    props: {
        spinner: {
            type: Boolean
        },
        item: [String, Object],
        width: {
            type: Number,
        },
        height: {
            type: Number,
        },
    },
    data() {
        return {
            imageWidth: 0,
            imageHeight: 0,
            loaded: false,
        }
    },
    watch: {
        'url': 'load',
    },
    mounted() {
        this.load();
    },
    methods: {
        load() {

            //console.log('Start Loading')
            var self = this;
            self.loaded = false;

            if (!self.url) {
                return;
            }

            var url = self.url;

            //Create a new image
            var img = new Image;


            //Once the image has loaded
            img.onload = function($event) {
                self.loaded = true;
                self.$emit('load', $event);


                self.imageWidth = img.width;
                self.imageHeight = img.height;

            }

            //Once the image has loaded
            img.onerror = function($event) {
                self.$emit('error', $event);
            }

            img.src = url;
        }
    },
    computed: {
        style() {

            var styles = {
                backgroundImage:this.backgroundImage,
            }

            if(this.width) {
                styles.width = `${this.width}px`;
            } else {
                styles.width = '100%';
            }

            if(this.height) {
                styles.height = `${this.height}px`;
            }



            return styles;
        },
        computedWidth() {
            return _.get(this.item, 'width') || this.width || this.imageWidth || 0;
        },
        computedHeight() {
            return _.get(this.item, 'height') || this.height || this.imageHeight || 0;
        },
        aspectRatio() {
            return (this.computedHeight / this.computedWidth * 100);
        },
        spacer() {
            var self = this;

            var style = {}

            if (self.aspectRatio) {
                style.height = `0`;
                style.paddingBottom = `${self.aspectRatio}%`;
            }

            return style;
        },
        imageID() {
            return this.$fluro.utils.getStringID(this.item);
        },
        url() {
            if (this.imageID) {
                //Allow the Fluro API to decide the best dimensions based on screensize
                return this.$fluro.asset.imageUrl(this.imageID, this.width, this.height, { includePublic: true });
            } else {
                return;
            }
        },
        placeholderImage() {
            if (this.imageID) {
                var placeholderUrl = this.$fluro.asset.imageUrl(this.imageID, 50, null, { includePublic: true });
                return `url(${placeholderUrl})`;
            } else {
                return;
            }
        },
        backgroundImage() {

            if (!this.url) {
                return;
            }

            return `url(${this.url})`;

        }
    }
}
</script>
<style scoped lang="scss">
.fade-enter-active,
.fade-leave-active {
    transition: opacity .8s;
}

.fade-enter,
.fade-leave-to {
    opacity: 0;
}


.fluro-image {
    overflow: hidden;
    max-width: 100%;
    position: relative;
    // background-color: #eee;
    background-size: 100% auto;
    background-repeat: no-repeat;
    background-position: center center;
    color: #fff;
    flex: 1 0 auto;



    .v-progress-circular {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate3d(-50%, -50%, 0);
    }

    .spacer {
        position: relative;
    }

    .placeholder {
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        // transition: opacity 0.2s;
        background-size: 100% auto;
        background-repeat: no-repeat;
        background-position: center center;
        // filter:blur(5px);
    }

    &[contain] {

        &,
        .placeholder {
            background-size: contain;
        }
    }

    &[cover] {

        &,
        .placeholder {
            background-size: cover;
        }
    }

    // &.loaded {
    //     .placeholder {
    //         opacity: 0;
    //     }
    // }

    img {
        width: 100%;
        display: block;
    }
}
</style>