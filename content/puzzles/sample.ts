// 하위호환 re-export: 기존 import 경로를 유지하는 코드가 있다면 계속 동작합니다.
// 신규 코드는 '@/content/puzzles' (index.ts) 에서 allPuzzles 를 직접 import 하세요.
export { allPuzzles as samplePuzzles } from './index'
export { allPuzzles } from './index'
export default undefined
