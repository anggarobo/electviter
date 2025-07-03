import path from 'path';
import winattr from 'winattr';
import fse from 'fs-extra';
import * as sizeOf from 'image-size';
import fsp from "fs/promises";

const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];

export function ensureHidden(filePath: string): Promise<boolean> {
    const base = path.basename(filePath)

    if (process.platform !== "win32") {
        return Promise.resolve(base.startsWith("."))
    }

    return new Promise(resolve => {
        winattr.get(filePath, (err, attrs) => {
            if (err || !attrs) return resolve(false)
            resolve(attrs.hidden)
        })
    })
}

export async function getFileDetails(filePath: string): Promise<Dir | null> {
    try {
        const stats = await fse.stat(filePath)
        let extension = path.extname(filePath).toLocaleLowerCase()
        const isImage = IMAGE_EXTENSIONS.includes(extension)
        const isHidden = await ensureHidden(filePath)

        if (extension.startsWith(".")) extension = extension.slice(1)

        const fileInfo: Dir = {
            name: path.basename(filePath),
            path: filePath,
            size: stats.size,
            ext: extension,
            isDirectory: stats.isDirectory(),
            isHidden,
            isBlockDevice: stats.isBlockDevice(),
            isCharacterDevice: stats.isCharacterDevice(),
            isFIFO: stats.isFIFO(),
            isFile: stats.isFile(),
            isSocket: stats.isSocket(),
            isSymbolicLink: stats.isSymbolicLink(),
        };

        if (!stats.isDirectory() && isImage) {
            try {
                const imageBuffer = await fsp.readFile(filePath);
                const dim = sizeOf.imageSize(imageBuffer);
                fileInfo.image = {
                    width: dim.width || 0,
                    height: dim.height || 0,
                    type: dim.type || ""
                }
                fileInfo.ext = dim.type

            } catch (error) {
                console.error(`Fail to read image dimension`, error);
            }
        }

        return fileInfo;
    } catch (err) {
        console.error(`Fail to read: ${filePath}`, err);
        return null;
    }
}

export async function readFolderRecursive(dir: string): Promise<Dir[]> {
  const results: Dir[] = [];
  const entries = await fsp.readdir(dir);
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry);
    // const stats = await fse.stat(fullPath);
    
    const detail = await getFileDetails(fullPath);
    if (detail) results.push(detail);
    // else result

    // if (stats.isDirectory()) {
    //   const subResults = await readFolderRecursive(fullPath);
    //   results.push(...subResults);
    // }
  }

  return results;
}
// ==== File Manager Tools ====

export async function copyFileOrFolder(src: string, dest: string): Promise<void> {
    try {
        await fse.copy(src, dest);
        console.log(`Copied: ${src} → ${dest}`);
    } catch (err) {
        console.error(`Gagal copy: ${(err as Error).message}`);
    }
}

export async function moveFileOrFolder(src: string, dest: string): Promise<void> {
    try {
        await fse.move(src, dest, { overwrite: true });
        console.log(`Moved: ${src} → ${dest}`);
    } catch (err) {
        console.error(`Gagal copy: ${(err as Error).message}`);
    }
}

export async function deleteFileOrFolder(targetPath: string): Promise<void> {
    try {
        await fse.remove(targetPath);
        console.log(`Deleted: ${targetPath}`);
    } catch (err) {
        console.error(`Gagal delete: ${(err as Error).message}`);
    }
}

export async function renameFileOrFolder(oldPath: string, newPath: string): Promise<void> {
    try {
        await fse.rename(oldPath, newPath);
        console.log(`Renamed: ${oldPath} → ${newPath}`);
    } catch (err) {
        console.error(`Gagal rename: ${(err as Error).message}`);
    }
}