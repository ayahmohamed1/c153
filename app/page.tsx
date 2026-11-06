import giftData from '@/lib/giftData'
import HomeExperience from '@/components/HomeExperience'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  metadataBase: new URL('https://loveyoloveyouloveyou.vercel.app'),
  title: 'Happy Anniversary habibty! 💙',
  description: 'A special anniversary letter for habibty',
  openGraph: {
    type: 'website',
    url: 'https://loveyoloveyouloveyou.vercel.app/',
    title: 'Happy Anniversary habibty! 💙',
    description: 'A special anniversary letter for habibty',
    images: [
      {
        url: '/images/love-preview.jpg',
        width: 768,
        height: 1024,
        alt: 'A glowing heart made of Love You messages',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Happy Anniversary habibty! 💙',
    description: 'A special anniversary letter for habibty',
    images: ['/images/love-preview.jpg'],
  },
}

export default function Home() {
  const data = giftData.yahya || giftData.aya
  return <HomeExperience data={data} />
}
