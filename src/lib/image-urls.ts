import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';

const IMAGE_URLS_DOC = 'settings/image_urls';

export interface ImageUrls {
  banners: Record<string, string>;
  categories: Record<string, string>;
  phases: Record<string, string>;
  machines: Record<string, string>;
  brands: Record<string, string>;
  defaults: Record<string, string>;
}

export async function getImageUrls(): Promise<ImageUrls> {
  try {
    const docRef = doc(db, IMAGE_URLS_DOC);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      const defaultUrls: ImageUrls = {
        banners: {
          hero: 'https://images.unsplash.com/photo-1581094288338-2314dddb7ece',
          categories: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122',
          about: 'https://images.unsplash.com/photo-1590496793907-51d60c2372f7'
        },
        categories: {
          construction: 'https://images.unsplash.com/photo-1581094288338-2314dddb7ece',
          industrial: 'https://images.unsplash.com/photo-1590964206343-fda64c3b6e3a',
          tools: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122'
        },
        phases: {
          foundation: 'https://images.unsplash.com/photo-1578074343921-c7547c788bd6',
          structure: 'https://images.unsplash.com/photo-1597844808175-66f8f064ba37',
          finishing: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407'
        },
        machines: {
          betoneira: 'https://images.unsplash.com/photo-1590496793907-51d60c2372f7',
          compressor: 'https://images.unsplash.com/photo-1597844801973-a69460728695',
          generator: 'https://images.unsplash.com/photo-1590964206343-fda64c3b6e3a'
        },
        brands: {
          makita: 'https://mariloc.com.br/storage/2024/07/makita.png',
          bosch: 'https://mariloc.com.br/storage/2024/07/bosch.png',
          csm: 'https://mariloc.com.br/storage/2024/07/csm.png'
        },
        defaults: {
          machine: 'https://images.unsplash.com/photo-1581094288338-2314dddb7ece',
          category: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122',
          profile: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e'
        }
      };

      await setDoc(docRef, defaultUrls);
      return defaultUrls;
    }

    return docSnap.data() as ImageUrls;
  } catch (error) {
    console.error('Error getting image URLs:', error);
    throw new Error('Falha ao carregar URLs das imagens');
  }
}

export async function updateImageUrls(type: keyof ImageUrls, urls: Record<string, string>) {
  try {
    const docRef = doc(db, IMAGE_URLS_DOC);
    await updateDoc(docRef, {
      [type]: urls
    });
  } catch (error) {
    console.error('Error updating image URLs:', error);
    throw new Error('Falha ao atualizar URLs das imagens');
  }
}