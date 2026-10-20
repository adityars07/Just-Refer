import React from 'react'

export interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string
  alt: string
  fill?: boolean
  sizes?: string
  priority?: boolean
  className?: string
}

export default function Image({ fill, className = '', style, ...props }: ImageProps) {
  const fillStyle: React.CSSProperties = fill
    ? { position: 'absolute', height: '100%', width: '100%', inset: 0, objectFit: 'cover' }
    : {}

  return (
    <img
      {...props}
      className={className}
      style={{ ...fillStyle, ...style }}
      loading={props.priority ? 'eager' : 'lazy'}
    />
  )
}
