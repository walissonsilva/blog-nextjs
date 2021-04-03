import { GetStaticPaths, GetStaticProps } from 'next';
import { FiCalendar, FiClock, FiUser } from 'react-icons/fi';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { useRouter } from 'next/router';
import Prismic from '@prismicio/client';
import { RichText } from 'prismic-dom';

import Header from '../../components/Header';
import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

interface Post {
  uid: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps) {
  const router = useRouter();

  const formatDate = (date: string) => {
    return format(
      new Date(date),
      'd LLL yyyy',
      {
        locale: ptBR,
      }
    )
  }

  const calculateReadingTime = () => {
    const qntWordsOnPost = post.data.content.reduce((wordsContent, content) => {
      const wordsOnBody = content.body.reduce((totalBody, body) => {
        return totalBody += body.text.split(" ").length;
      }, 0);
      return wordsContent += content.heading.split(" ").length + wordsOnBody;
    }, 0);

    const qntWordsReadPerMinute = 200;

    return Math.ceil(qntWordsOnPost / qntWordsReadPerMinute);
  }

  calculateReadingTime();
  
  return (
    <>
      {!router.isFallback ? <div className={styles.container}>
        <div className={`${commonStyles.container}`}>
          <Header />
        </div>

        <img src={post.data.banner.url} alt="banner"/>

        <article className={styles.content}>
          <h1>{post.data.title}</h1>
          <div className={styles.postInfo}>
            <span>
              <i>
                <FiCalendar />
              </i>
              <span>{formatDate(post.first_publication_date)}</span>
            </span>
            <span>
              <i>
                <FiUser />
              </i>
              <span>{post.data.author}</span>
            </span>
            <span>
              <i>
                <FiClock />
              </i>
              <span>{`${calculateReadingTime()} min`}</span>
            </span>
          </div>

          <main>
            { post.data.content.map(content => (
              <section key={content.heading}>
                <h2>{ content.heading }</h2>
                { content.body.map((body, index) => (
                  <p key={index}>{ body.text }</p>
                )) }
              </section>
            )) }
          </main>
        </article>
      </div> : (
        <h2>Carregando...</h2>
      )}
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient();
  const posts = await prismic.query([
    Prismic.Predicates.at('document.type', 'posts')
  ], {
    fetch: [],
    pageSize: 1,
  });

  return {
    paths: posts.results.map(post => (
      { params: { slug: post.uid } }
    )),
    fallback: true,
  }
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const prismic = getPrismicClient();
  const { slug } = params;

  const response = await prismic.getByUID(
    'posts', String(slug), {}
  );

  const post: Post = {
    uid: response.uid,
    first_publication_date: response.first_publication_date,
    data: {
      title: response.data.title,
      subtitle: response.data.subtitle,
      author: response.data.author,
      banner: {
        url: response.data.banner.url,
      },
      content: response.data.content,
    }
  }

  return {
    props: {
      post,
    },
    revalidate: 10 * 60,
  }
};
