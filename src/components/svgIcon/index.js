/*
 * @Author: 邓官妮
 * @Date: 2022-04-20 17:13:36
 * @LastEditors: 邓官妮
 * @LastEditTime: 2022-04-20 17:19:46
 * @Description: file content
 */

import svgIcon from './index.vue';

export default {
  install(Vue) {
    Vue.component(svgIcon.name, svgIcon);
  },
};
