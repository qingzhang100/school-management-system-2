import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://staadahatogsggvzftpf.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN0YWFkYWhhdG9nc2dndnpmdHBmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwNzI3MTUsImV4cCI6MjA3ODY0ODcxNX0._cDiD86-kWBnWyVEiikyFylw1bfyTUY5tMnuXHp2HVY";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
