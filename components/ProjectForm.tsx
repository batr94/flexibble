"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from 'next/navigation'; 
import { ProjectForm, SessionInterface } from "@/common.types";
import FormField from "./FormField";
import CustomMenu from "./CustomMenu";
import { categoryFilters } from "@/constants";
import Button from "./Button";
import { createNewProject, fetchToken } from "@/lib/actions";

type Props = {
  type: string;
  session: SessionInterface;
};

const ProjectForm = ({ session, type }: Props) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState<ProjectForm>({
    title: '',
    description: '',
    liveSiteUrl: '',
    githubUrl: '',
    image: '',
    category: '',
  });
  const router = useRouter();

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);

    try {
      const token = await fetchToken();
      if (type === 'create') {
        await createNewProject(form, session?.user?.id, token);
        router.push('/');
      }
       
    } catch (e) {
      console.log(e);
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const file = e.target?.files?.[0];

    if(!file) {
      return;
    }

    if(!file.type.includes('image')) {
      return alert('Please upload an image file')
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;

      handleStateChange('image', result);
    }
  };
  const handleStateChange = (fieldName: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  return (
    <form className="flexStart form" onSubmit={handleFormSubmit}>
      <div className="flexStart form_image-container">
        <label htmlFor="poster" className="flexCenter form_image-label">
          {!form?.image && "Choose poster for your project"}
          <input
            className="form_image-input"
            type="file"
            id="image"
            accept="image/*"
            required={type === "create"}
            onChange={handleChangeImage}
          />
          {form?.image && (
            <Image
              src={form?.image}
              className="sm:p-10 object-contain z-20"
              alt="Project poster"
              fill
            />
          )}
        </label>
      </div>

      <FormField
        title="Title"
        state={form.title}
        placeholder="Flexibble"
        setState={(value) => handleStateChange("title", value)}
      />

      <FormField
        title="Description"
        state={form.description}
        placeholder="Flexibble"
        setState={(value) => handleStateChange("description", value)}
      />

      <FormField
        type="url"
        title="Website URL"
        state={form.liveSiteUrl}
        placeholder="https://website.url"
        setState={(value) => handleStateChange("liveSiteUrl", value)}
      />
      <FormField
        type="url"
        title="GitHub URL"
        state={form.githubUrl}
        placeholder="https://github.com/you_guthub"
        setState={(value) => handleStateChange("githubUrl", value)}
      />

      <CustomMenu
        title="Category"
        filters={categoryFilters}
        setState={(value) => handleStateChange('category', value)}
        state={form.category}
      />

      <div className="flexStart w-full">
        <Button
          title={isSubmitting
            ? `${type === 'create' ? 'Creating...' : 'Editing...'}`
            : `${type === 'create' ? 'Create' : 'Edit'}`
          }
          type='submit'
          isSubmitting={isSubmitting}
          leftIcon={isSubmitting ? '' : '/plus.svg'}
        />
      </div>
    </form>
  );
};

export default ProjectForm;
