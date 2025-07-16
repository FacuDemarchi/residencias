import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";

export type Tag = {
  name: string;
  created_at: string;
};

type TagsContextType = {
  tags: Tag[];
  loading: boolean;
};

const TagsContext = createContext<TagsContextType>({ tags: [], loading: true });

export const useTags = () => useContext(TagsContext);

export const TagsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTags = async () => {
      const { data, error } = await supabase.from("tags").select("*");
      console.log('Respuesta de Supabase (tags):', { data, error });
      if (!error && data) setTags(data);
      setLoading(false);
    };
    fetchTags();
  }, []);

  return (
    <TagsContext.Provider value={{ tags, loading }}>
      {children}
    </TagsContext.Provider>
  );
}; 