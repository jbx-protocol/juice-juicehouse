import { CloseOutlined } from '@ant-design/icons'
import { Image, ImageProps } from 'antd'
import { JuiceVideoPreview } from 'components/NftVideo/JuiceVideoPreview'
import { MP4_FILE_TYPE } from 'constants/fileTypes'
import { useContentType } from 'hooks/ContentType'

export const JUICE_IMG_PREVIEW_CONTAINER_CLASS =
  'fixed top-0 left-0 z-[10000] flex h-full w-full items-center justify-center overflow-auto bg-[rgba(0,0,0,0.8)] p-5'

export function JuiceVideoOrImgPreview({
  src,
  alt,
  visible,
  onClose,
  ...props
}: ImageProps & {
  visible: boolean
  onClose: VoidFunction
}) {
  if (!visible || !src) return null

  const { data: contentType } = useContentType(src)
  const isVideo = contentType === MP4_FILE_TYPE

  return (
    <div className={JUICE_IMG_PREVIEW_CONTAINER_CLASS} onClick={onClose}>
      <CloseOutlined
        className="absolute top-10 right-10 pl-4 text-2xl text-slate-100"
        onClick={onClose}
      />
      <div className="text-center">
        {isVideo ? (
          <JuiceVideoPreview src={src} />
        ) : (
          <Image
            className="max-h-[50vh] md:max-h-[60vh]"
            alt={alt}
            src={src}
            onClick={e => e.stopPropagation()}
            crossOrigin="anonymous"
            preview={false}
            {...props}
          />
        )}
      </div>
    </div>
  )
}
