import Head from 'next/head';
import Hero from '@/components/Hero';
import About from '@/components/About';
import ProjectList from '@/components/ProjectList';
import JobProposalForm from '@/components/JobProposalForm';
import getNotionData from '@/lib/notion';
import type { NotionProject } from '@/types/notion';

export default function Home({ projects }: { projects: NotionProject[] }) {
  return (
    <>
      <Head>
        <title>Yoon.log — Web Developer</title>
        <meta name="description" content="노션 API를 활용한 웹 개발자 윤의 포트폴리오" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Hero />
      <About projectCount={projects.length} />
      <ProjectList projects={projects} />
      <JobProposalForm />
    </>
  );
}

export async function getStaticProps() {
  try {
    const projects = await getNotionData();
    return {
      props: { projects },
      revalidate: 3600,
    };
  } catch {
    return { props: { projects: [] } };
  }
}
