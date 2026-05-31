export type ZipFile = {
  content: string;
  path: string;
};

export function createZip(files: ZipFile[]) {
  const encoder = new TextEncoder();
  const localParts: Uint8Array[] = [];
  const centralParts: Uint8Array[] = [];
  let offset = 0;

  for (const file of files) {
    const name = encoder.encode(file.path);
    const content = encoder.encode(file.content);
    const crc = crc32(content);
    const localHeader = zipHeader(0x04034b50, [20, 0, 0, crc, content.length, content.length, name.length, 0]);

    localParts.push(localHeader, name, content);
    centralParts.push(
      zipHeader(0x02014b50, [20, 20, 0, 0, crc, content.length, content.length, name.length, 0, 0, 0, 0, 0, offset]),
      name,
    );
    offset += localHeader.length + name.length + content.length;
  }

  const centralSize = centralParts.reduce((total, part) => total + part.length, 0);
  const end = zipHeader(0x06054b50, [0, 0, files.length, files.length, centralSize, offset, 0]);

  return concatBytes([...localParts, ...centralParts, end]);
}

function zipHeader(signature: number, values: number[]) {
  const isLocal = signature === 0x04034b50;
  const isCentral = signature === 0x02014b50;
  const bytes = new Uint8Array(isLocal ? 30 : isCentral ? 46 : 22);
  const view = new DataView(bytes.buffer);

  view.setUint32(0, signature, true);

  if (isLocal) {
    const [version, flags, compression, crc, compressedSize, size, nameLength, extraLength] = values;
    view.setUint16(4, version, true);
    view.setUint16(6, flags, true);
    view.setUint16(8, compression, true);
    view.setUint32(14, crc, true);
    view.setUint32(18, compressedSize, true);
    view.setUint32(22, size, true);
    view.setUint16(26, nameLength, true);
    view.setUint16(28, extraLength, true);
    return bytes;
  }

  if (isCentral) {
    const [madeBy, version, flags, compression, crc, compressedSize, size, nameLength, extraLength, commentLength, disk, attributes, externalAttributes, localOffset] = values;
    view.setUint16(4, madeBy, true);
    view.setUint16(6, version, true);
    view.setUint16(8, flags, true);
    view.setUint16(10, compression, true);
    view.setUint32(16, crc, true);
    view.setUint32(20, compressedSize, true);
    view.setUint32(24, size, true);
    view.setUint16(28, nameLength, true);
    view.setUint16(30, extraLength, true);
    view.setUint16(32, commentLength, true);
    view.setUint16(34, disk, true);
    view.setUint16(36, attributes, true);
    view.setUint32(38, externalAttributes, true);
    view.setUint32(42, localOffset, true);
    return bytes;
  }

  const [disk, centralDisk, entries, totalEntries, centralSize, centralOffset, commentLength] = values;
  view.setUint16(4, disk, true);
  view.setUint16(6, centralDisk, true);
  view.setUint16(8, entries, true);
  view.setUint16(10, totalEntries, true);
  view.setUint32(12, centralSize, true);
  view.setUint32(16, centralOffset, true);
  view.setUint16(20, commentLength, true);

  return bytes;
}

function concatBytes(parts: Uint8Array[]) {
  const output = new Uint8Array(parts.reduce((total, part) => total + part.length, 0));
  let offset = 0;

  for (const part of parts) {
    output.set(part, offset);
    offset += part.length;
  }

  return output;
}

function crc32(bytes: Uint8Array) {
  let crc = 0xffffffff;

  for (const byte of bytes) {
    crc ^= byte;
    for (let index = 0; index < 8; index += 1) {
      crc = crc & 1 ? (crc >>> 1) ^ 0xedb88320 : crc >>> 1;
    }
  }

  return (crc ^ 0xffffffff) >>> 0;
}
