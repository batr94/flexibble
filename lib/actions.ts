import { ProjectForm } from "@/common.types";
import { categoryFilters } from "@/constants";
import { createProjectMutation, createUserMutation, deleteProjectMutation, getProjectByIdQuery, getProjectsOfUserQuery, getUserQuery, projectsQuery } from "@/graphql";
import { GraphQLClient } from "graphql-request";

const isProduction = process.env.NODE_ENV === 'production';
const apiUrl = isProduction ? process.env.NEXT_PUBLIC_GRAFBASE_API_URL || '' : 'http://127.0.0.1:4000/graphql';
const apiKey = isProduction ? process.env.NEXT_PUBLIC_GRAFBASE_API_KEY || '' : 'hjvhbkjn';
const serverUrl = isProduction ? process.env.NEXT_PUBLIC_SERVER_URL || '' : 'http://localhost:3000';
const client = new GraphQLClient(apiUrl);

const makeGraphQLRequest = async (query: string, variables = {}) => {
    try {
        return client.request(query, variables);
    } catch (error) {
        throw error;
    }
}

export const getUser = (email: string) => {
    return makeGraphQLRequest(getUserQuery, { email });
}

export const createUser = (name: string, email: string, avatarUrl: string) => {
    const variables = {
        input: { name, email, avatarUrl },
    }

    client.setHeader('x-api-key', apiKey);
    return makeGraphQLRequest(createUserMutation, variables);
}

export const fetchToken = async (): Promise<string> => {
    const response = await fetch(`${serverUrl}/api/auth/token`);
    const { token } = await response.json();

    return token;
}

export const uploadImage = async (imagePath: string) => {
    try {
        const response = await fetch(`${serverUrl}/api/upload/`, {
            method: 'POST',
            body: JSON.stringify({ path: imagePath }),
        });

        return response.json();
    } catch (error) {
        throw error;
    }
}

export const createNewProject = async (form: ProjectForm, creatorId: string, token: string) => {
    const image = await uploadImage(form.image);

    if (image.url) {
        client.setHeader('Authorization', `Bearer ${token}`);

        const variables = {
            input: {
                ...form,
                image: image.url,
                createdBy: {
                    link: creatorId,
                },
            },
        }
        
        return makeGraphQLRequest(createProjectMutation, variables);
    }
}

export const fetchAllProjects = async (category?: string, endcursor?: string) => {
    const categories = category ? [category] : categoryFilters;
    client.setHeader('x-api-key', apiKey);
    
    return await makeGraphQLRequest(projectsQuery, { categories, endcursor })
}

export const getProjectDetails = async (id: string) => {
    client.setHeader('x-api-key', apiKey);
    return await makeGraphQLRequest(getProjectByIdQuery, { id });
}

export const getUserProfile = async (id: string, last?: number) => {
    client.setHeader('x-api-key', apiKey);

    return await makeGraphQLRequest(getProjectsOfUserQuery, { id, last })
}

export const deleteProject = async (id: string, token: string) => {
    client.setHeader('Authorization', `Bearer ${token}`);
    
    return await makeGraphQLRequest(deleteProjectMutation, {id});
}