<template>
  <Tooltip v-if="mixinState.mSelectMode === 'one'" :content="$t('quick.copy')">
    <!-- <Button @click="clone"  type="text"> -->
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">

        <g transform="translate(-3662 203)">
          <rect class="a" width="20" height="20" transform="translate(3662 -203)" />
          <g transform="translate(3658 -205)">
            <path class="b"
              d="M8.757,19.146h10.6a.757.757,0,0,0,.757-.757V7.787H16.33V4H8.757A.757.757,0,0,0,8,4.757V18.389A.757.757,0,0,0,8.757,19.146Z" />
            <path class="b" d="M30,4l3.787,3.787" transform="translate(-13.67)" />
          </g>
        </g>
      </svg>
    <!-- </Button> -->
  </Tooltip>
</template>

<script setup name="Clone">
import useSelect from '@/hooks/select';
import { debounce } from 'lodash-es';

const { mixinState, canvasEditor } = useSelect();
const clone = debounce(function () {
  canvasEditor.clone();
}, 300);
</script>
<style>
.a {
  fill: #fff;
  opacity: 0;
}

.b {
  fill: none;
  stroke: #4e5969;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.5px;
}
</style>
