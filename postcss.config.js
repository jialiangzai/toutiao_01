/* 针对webpack */
module.exports = {
  plugins: {
    'postcss-pxtorem': {
      rootValue: 37.5, // 屏宽/10 = 1rem
      // 如果不转css属性      语法：!'css属性名'(不转rem的css属性名) 改完记得重启
      propList: ['*', '!border'] // 要转换的样式属性=》*代表转换所有css属性的样式
    }
  }
}
