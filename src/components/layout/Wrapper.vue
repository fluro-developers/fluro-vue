<template>
    <section>
        <slot></slot>
    </section>
</template>
<script>
export default {

}
</script>
<style scoped lang="scss">
//Use 100px by default
$wrapper-padding: 70px;
$tablet-wrapper-padding: 50px;
$mobile-wrapper-padding: 30px;

//Titles shouldn't have the exact same padding
$title-fraction: 0.5;
$title-fraction-xs: $title-fraction;
$title-fraction-sm: $title-fraction;
$title-fraction-lg: $title-fraction / 3;
$title-fraction-xl: $title-fraction / 3;

section {
    padding: $wrapper-padding 0;

    [title] {
        padding-bottom: floor($wrapper-padding) * $title-fraction;
    }


    &[xs] {
        padding: floor($wrapper-padding / 3) 0;

        [title] {
            padding-bottom: floor($wrapper-padding / 3) * $title-fraction-xs;
        }
    }

    &[sm] {
        padding: floor($wrapper-padding / 2) 0;

        [title] {
            padding-bottom: floor($wrapper-padding / 2) * $title-fraction-sm;
        }
    }

    &[lg] {
        padding: floor($wrapper-padding * 2) 0;

        [title] {
            padding-bottom: floor($wrapper-padding * 2) * $title-fraction-lg;
        }
    }

    &[xl] {
        padding: floor($wrapper-padding * 3) 0;

        [title] {
            padding-bottom: floor($wrapper-padding * 3) * $title-fraction-xl;
        }
    }

    //////////////////////////////////////////////////////

    @media(max-width: 1024px) {
        padding: $tablet-wrapper-padding 0;

        [title] {
            padding-bottom: floor($tablet-wrapper-padding) * $title-fraction;
        }

        &[xs] {
            padding: floor($tablet-wrapper-padding / 3) 0;

            [title] {
                padding-bottom: floor($tablet-wrapper-padding / 3) * $title-fraction-xs;
            }
        }

        &[sm] {
            padding: floor($tablet-wrapper-padding / 2) 0;

            [title] {
                padding-bottom: floor($tablet-wrapper-padding / 2) * $title-fraction-sm;
            }
        }

        &[lg] {
            padding: floor($tablet-wrapper-padding * 2) 0;

            [title] {
                padding-bottom: floor($tablet-wrapper-padding * 2) * $title-fraction-lg;
            }
        }

        &[xl] {
            padding: floor($tablet-wrapper-padding * 3) 0;

            [title] {
                padding-bottom: floor($tablet-wrapper-padding * 3) * $title-fraction-xl;
            }
        }
    }

    @media(max-width: 768px) {
        padding: $mobile-wrapper-padding 0;

        [title] {
            padding-bottom: floor($mobile-wrapper-padding) * $title-fraction;
        }

        &[xs] {
            padding: floor($mobile-wrapper-padding / 3) 0;

            [title] {
                padding-bottom: floor($mobile-wrapper-padding / 3) * $title-fraction-xs;
            }
        }

        &[sm] {
            padding: floor($mobile-wrapper-padding / 2) 0;

            [title] {
                padding-bottom: floor($mobile-wrapper-padding / 2) * $title-fraction-sm;
            }
        }

        &[lg] {
            padding: floor($mobile-wrapper-padding * 2) 0;

            [title] {
                padding-bottom: floor($mobile-wrapper-padding * 2) * $title-fraction-lg;
            }
        }

        &[xl] {
            padding: floor($mobile-wrapper-padding * 3) 0;

            [title] {
                padding-bottom: floor($mobile-wrapper-padding * 3) * $title-fraction-xl;
            }
        }
    }
}


// .block + .block {
//  padding-top:0;
// }

// @media(max-width: 768px) {
//  .block {
//      padding: 0;
//  }
// }
</style>