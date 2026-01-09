export function generateDisplayName(): string {
  const randomNum = Math.floor(Math.random() * 10000);
  return `hater_${randomNum}`;
}
