import { GetStaticProps } from 'next';
import Head from 'next/head';
import Header from '../components/Header';
import Prismic from '@prismicio/client';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR'

import { getPrismicClient } from '../services/prismic';

import {
  FiCalendar,
  FiUser,
} from 'react-icons/fi';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
import Link from 'next/link';
import { useState } from 'react';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({ postsPagination }: HomeProps) {
  const [hasNextPage, setHasNextPage] = useState(postsPagination?.next_page);
  const [posts, setPosts] = useState<Post[]>(formatPosts(postsPagination.results));

  function formatPosts(posts: Post[]) {
    return posts.map(post => {
      return {
        uid: post.uid,
        data: {
          title: post.data.title,
          subtitle: post.data.subtitle,
          author: post.data.author,
        },
        first_publication_date: format(
          new Date(post.first_publication_date),
          'd LLL yyyy',
          {
            locale: ptBR,
          }
        )
      }
    })
  }
  
  async function handleLoadMorePosts(next_page: string) {
    const response = await fetch(next_page);
    const data = await response.json();

    const newPosts = formatPosts(data.results);

    setHasNextPage(data.next_page);
    setPosts([
      ...posts,
      ...newPosts
    ])
  }

  return (
    <>
      <Head>
        <title>Home | Blog</title>
      </Head>

      <main className={`${commonStyles.container} ${styles.container}`}>
        <Header />
        
        <section>
          { posts.map(post => (
            <article key={post.uid}>
              <Link href={`/post/${post.uid}`}>
                <h2>{post.data.title}</h2>
              </Link>
              <p>{post.data.subtitle}</p>

              <div className={styles.dateAuthor}>
                <span>
                  <i>
                    <FiCalendar />
                  </i>
                  <span>{post.first_publication_date}</span>
                </span>
                <span>
                  <i>
                    <FiUser />
                  </i>
                  <span>{post.data.author}</span>
                </span>
              </div>
            </article>
          )) }

          { hasNextPage && <button
              className={styles.loadMoreButton}
              onClick={() => handleLoadMorePosts(postsPagination.next_page)}
            >
            Carregar mais posts
          </button> }
        </section>
      </main>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();
  const postResponse = await prismic.query([
    Prismic.predicates.at('document.type', 'posts')
  ], {
    fetch: [],
    pageSize: 3,
  });
  
  const posts = postResponse.results.map(post => {
    return {
      uid: post.uid,
      data: {
        title: post.data.title,
        subtitle: post.data.subtitle,
        author: post.data.author,
      },
      first_publication_date: post.first_publication_date,
    }
  });
  
  return {
    props: {
      postsPagination: {
        next_page: postResponse.next_page,
        results: posts,
      }
    },
    revalidate: 10 * 60,
  }
}
