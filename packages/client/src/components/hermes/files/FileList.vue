<script setup lang="ts">
import { NButton, NSpin, NEmpty, useMessage } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import { useFilesStore, isImageFile, isMarkdownFile, isTextFile } from '@/stores/hermes/files'
import { downloadFile } from '@/api/hermes/download'
import type { FileEntry } from '@/api/hermes/files'
import {
  Archive,
  ClipboardList,
  Download,
  File,
  FileCode2,
  FileText,
  Folder,
  Image,
  Pencil,
  ScrollText,
  Settings,
  Zap,
} from 'lucide-vue-next'

const { t } = useI18n()
const message = useMessage()
const filesStore = useFilesStore()

const emit = defineEmits<{
  (e: 'contextmenu-entry', event: MouseEvent, entry: FileEntry): void
}>()

function formatSize(bytes: number): string {
  if (bytes === 0) return '—'
  const units = ['B', 'KB', 'MB', 'GB']
  let i = 0
  let size = bytes
  while (size >= 1024 && i < units.length - 1) {
    size /= 1024
    i++
  }
  return `${size.toFixed(i === 0 ? 0 : 1)} ${units[i]}`
}

function formatDate(iso: string): string {
  if (!iso) return '—'
  const d = new Date(iso)
  return d.toLocaleString()
}

function getFileIcon(entry: FileEntry) {
  if (entry.isDir) return Folder
  const ext = entry.name.split('.').pop()?.toLowerCase() || ''
  const iconMap: Record<string, any> = {
    yaml: Settings, yml: Settings, json: ClipboardList, toml: Settings,
    md: ScrollText, txt: FileText, log: FileText,
    py: FileCode2, js: FileCode2, ts: FileCode2, vue: FileCode2,
    png: Image, jpg: Image, jpeg: Image, gif: Image, svg: Image, webp: Image,
    zip: Archive, gz: Archive, tar: Archive,
    sh: Zap, bash: Zap,
  }
  return iconMap[ext] || File
}

function handleDoubleClick(entry: FileEntry) {
  if (entry.isDir) {
    filesStore.navigateTo(entry.path)
  } else if (isTextFile(entry.name)) {
    filesStore.openEditor(entry.path)
  } else if (isImageFile(entry.name) || isMarkdownFile(entry.name)) {
    filesStore.openPreview(entry)
  }
}

function handleContextMenu(e: MouseEvent, entry: FileEntry) {
  e.preventDefault()
  emit('contextmenu-entry', e, entry)
}

async function handleDownload(entry: FileEntry) {
  try {
    await downloadFile(entry.path, entry.name)
  } catch (err: any) {
    message.error(err.message || t('files.backendError'))
  }
}
</script>

<template>
  <div class="file-list">
    <NSpin :show="filesStore.loading">
      <NEmpty v-if="!filesStore.loading && filesStore.sortedEntries.length === 0" :description="t('files.emptyDir')" />
      <div v-else class="file-list-items">
        <div class="file-list-header">
          <div class="file-name sort-header" @click="filesStore.setSort('name')">
            {{ t('files.name') }}
            <span v-if="filesStore.sortBy === 'name'" class="sort-indicator">{{ filesStore.sortOrder === 'asc' ? '↑' : '↓' }}</span>
          </div>
          <div class="file-size sort-header" @click="filesStore.setSort('size')">
            {{ t('files.size') }}
            <span v-if="filesStore.sortBy === 'size'" class="sort-indicator">{{ filesStore.sortOrder === 'asc' ? '↑' : '↓' }}</span>
          </div>
          <div class="file-date sort-header" @click="filesStore.setSort('modTime')">
            {{ t('files.modified') }}
            <span v-if="filesStore.sortBy === 'modTime'" class="sort-indicator">{{ filesStore.sortOrder === 'asc' ? '↑' : '↓' }}</span>
          </div>
          <div class="file-actions-placeholder" />
        </div>
        <div
          v-for="entry in filesStore.sortedEntries"
          :key="entry.path"
          class="file-list-row"
          @dblclick="handleDoubleClick(entry)"
          @contextmenu="handleContextMenu($event, entry)"
        >
          <div class="file-name">
            <component :is="getFileIcon(entry)" class="file-icon" :size="15" :stroke-width="1.7" aria-hidden="true" />
            <span>{{ entry.name }}</span>
          </div>
          <div class="file-size">{{ entry.isDir ? '—' : formatSize(entry.size) }}</div>
          <div class="file-date">{{ formatDate(entry.modTime) }}</div>
          <div class="file-actions">
            <NButton v-if="isTextFile(entry.name) && !entry.isDir" size="tiny" quaternary @click.stop="filesStore.openEditor(entry.path)" :title="t('files.edit')">
              <template #icon><Pencil :size="13" :stroke-width="1.8" /></template>
            </NButton>
            <NButton v-if="!entry.isDir" size="tiny" quaternary @click.stop="handleDownload(entry)" :title="t('files.download')">
              <template #icon><Download :size="13" :stroke-width="1.8" /></template>
            </NButton>
          </div>
        </div>
      </div>
    </NSpin>
  </div>
</template>

<style scoped lang="scss">
@use '@/styles/variables' as *;

.file-list {
  padding: 6px 12px;
}

.file-list-header {
  display: flex;
  align-items: center;
  padding: 5px 10px;
  gap: 12px;
  font-size: 12px;
  font-weight: 500;
  color: $text-muted;
  border-bottom: 1px solid $border-light;
  margin-bottom: 4px;
  user-select: none;
}

.sort-header {
  cursor: pointer;

  &:hover {
    color: $text-primary;
  }
}

.sort-indicator {
  margin-left: 2px;
  font-size: 11px;
}

.file-actions-placeholder {
  width: 60px;
  flex-shrink: 0;
}

.file-list-row {
  display: flex;
  align-items: center;
  padding: 6px 10px;
  border-radius: $radius-sm;
  cursor: pointer;
  gap: 12px;
  font-size: 12px;

  &:hover {
    background-color: rgba(var(--accent-primary-rgb), 0.06);

    .file-actions {
      opacity: 1;
    }
  }
}

.file-name {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.file-icon {
  flex-shrink: 0;
}

.file-size {
  width: 80px;
  text-align: right;
  color: $text-secondary;
  flex-shrink: 0;
}

.file-date {
  width: 160px;
  color: $text-secondary;
  flex-shrink: 0;
}

.file-actions {
  opacity: 0;
  transition: opacity $transition-fast;
  display: flex;
  gap: 4px;
  flex-shrink: 0;
}

@media (max-width: $breakpoint-mobile) {
  .file-size, .file-date {
    display: none;
  }
}
</style>
