export type SeasonTheme = {
  /** 展示名称，默认使用赛季编码 */
  title?: string
  /** 副标题/标语，默认使用赛季介绍 */
  description?: string
  /** 主题海报图片地址，可以是相对 public/ 的路径 */
  poster?: string
  /** 渐变起始颜色 */
  gradientFrom?: string
  /** 渐变结束颜色 */
  gradientTo?: string
}

export const DEFAULT_SEASON_THEME: Required<Pick<SeasonTheme, 'gradientFrom' | 'gradientTo'>> & SeasonTheme = {
  title: '热门阵容',
  description: '选择赛季即可查看该主题下的热门阵容',
  gradientFrom: 'rgba(15, 23, 42, 0.85)',
  gradientTo: 'rgba(30, 64, 175, 0.75)'
}

export const SEASON_THEMES: Record<string, SeasonTheme> = {
  /** 示例：可替换为后端返回或实际上传的海报 */
  S15: {
    title: '灵能觉醒',
    description: '灵能奔涌，重构属于你的金铲铲阵容宇宙。',
    poster: '/posters/s15.svg',
    gradientFrom: 'rgba(59, 130, 246, 0.8)',
    gradientTo: 'rgba(217, 70, 239, 0.7)'
  }
}
