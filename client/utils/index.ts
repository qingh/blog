export function format (timeStrin: string) {
  let time = new Date(timeStrin)
  const year = time.getFullYear()
  const month = (time.getMonth() + 1).toString().padStart(2, '0')
  const day = time.getDate().toString().padStart(2, '0')
  const hour = time.getHours().toString().padStart(2, '0')
  const minute = time.getMinutes().toString().padStart(2, '0')
  const second = time.getSeconds().toString().padStart(2, '0')
  return `${year}-${month}-${day} ${hour}:${minute}:${second}`
}