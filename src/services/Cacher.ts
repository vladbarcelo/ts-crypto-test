import { ICacher, CacheItem } from '../common/types'
import { readFileSync, writeFileSync, existsSync, unlinkSync, readdirSync } from 'fs'
import { join } from 'path'

abstract class AbstractCacher implements ICacher {
  abstract set(key: string, value: string): void
  abstract get(key: string): string | null
  abstract checkValidity(key: string): boolean
  abstract invalidate(key: string): void
  abstract invalidateAll(): void
  abstract getCacheItem(key: string): CacheItem | null
  abstract setCacheItem(key: string, data: CacheItem): void
  abstract getCachePath(key: string): string
}

export class Cacher extends AbstractCacher {
  getCachePath(key: string): string {
    return `${process.env.CACHE_PATH}/${key}.json`
  }
  setCacheItem(key: string, data: CacheItem) {
    writeFileSync(this.getCachePath(key), JSON.stringify(data))
  }
  getCacheItem(key: string): CacheItem | null {
    if (!existsSync(this.getCachePath(key))) {
      return null
    }
    return JSON.parse(String(readFileSync(this.getCachePath(key))))
  }
  set(key: string, value: string) {
    const tStamp = Date.now()
    const data = {
      tStamp,
      value
    }
    this.setCacheItem(key, data)
  }
  get(key: string): string | null {
    const data = this.getCacheItem(key)
    return data ? data.value : null
  }
  checkValidity(key: string): boolean {
    if (!existsSync(this.getCachePath(key))) {
      return false
    }
    const data = JSON.parse(this.get(key))
    const cacheTStamp = new Date(data.tStamp)
    const currentTStamp = new Date()
    const diff = Math.abs(currentTStamp.getTime() - cacheTStamp.getTime());
    const diffMinutes = Math.ceil(diff / (1000 * 60));
    if (diffMinutes < Number(process.env.CACHE_DURATION_MINUTES || 1)) {
      return false
    }
    return true
  }
  invalidate(key: string) {
    unlinkSync(this.getCachePath(key))
  }
  invalidateAll() {
    const directory = process.env.CACHE_PATH
    for (let file of readdirSync(directory)) {
      if (file !== '.gitkeep') {
        unlinkSync(join(directory, file))
      }
    }
  }
}