import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://wvfntqvjctfmyaecnoxm.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind2Zm50cXZqY3RmbXlhZWNub3htIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUwNzcwMjgsImV4cCI6MjA1MDY1MzAyOH0._CZaEYv_qUuDEa-KeDXbkq1gWn1-Wphyjvh4jRaJd7c";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
