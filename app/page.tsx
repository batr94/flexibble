import ProjectCard from "@/components/ProjectCard";
import { ProjectInterface } from "@/common.types";
import { fetchAllProjects } from "@/lib/actions";
import Categories from "@/components/Categories";
import LoadMore from "@/components/LoadMore";

type ProjectSearch = {
    projectSearch: {
        edges: { node: ProjectInterface }[],
        pageInfo: {
            hasPreviousPage: boolean,
            hasNextPage: boolean,
            startCursor: string,
            endCursor: string,
        },
    },
}

type SearchParams = {
    category?: string;
    endcursor?: string;
    startcursor?: string;
}

type Props = {
    searchParams: SearchParams;
}

const Home = async ({ searchParams: { category, endcursor } }: Props) => {
    const data = await fetchAllProjects(category, endcursor) as ProjectSearch;
    const projectsToDisplay = data?.projectSearch?.edges || [];
    const {
        startCursor,
        endCursor,
        hasPreviousPage,
        hasNextPage
    } = data?.projectSearch?.pageInfo;

    if (projectsToDisplay.length === 0) {
        return (
            <section className="flexStart flex-col paddings">
                <Categories />

                <p className="no-results-text text-center">No projects found. Go create some first.</p>
            </section>
        );
    }

    return (
        <section className="flex-start flex-col paddings mb-16">
            <Categories />
            <section className="projects-grid">
                {projectsToDisplay.map(({ node }: { node: ProjectInterface }) => (
                    <ProjectCard
                        key={node?.id}
                        id={node?.id}
                        image={node?.image}
                        title={node?.title}
                        name={node?.createdBy?.name}
                        avatarUrl={node?.createdBy?.avatarUrl}
                        userId={node?.createdBy?.id}
                    />
                ) )}
            </section>
            <LoadMore
                startCursor={startCursor}
                endCursor={endCursor}
                hasPreviousPage={hasPreviousPage}
                hasNextPage={hasNextPage}
            />
        </section>
    );
}

export default Home;