// The workaround: remove the story-level `globals` so each mode picks its own snapshot.
import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
const dir = 'test-results/chromatic-archives'
for (const file of readdirSync(dir).filter((f) => f.endsWith('.stories.json'))) {
  const json = JSON.parse(readFileSync(`${dir}/${file}`, 'utf8'))
  json.stories.forEach((story) => delete story.globals)
  writeFileSync(`${dir}/${file}`, JSON.stringify(json, null, 2))
  console.log(`Removed story-level globals from ${file}`)
}
