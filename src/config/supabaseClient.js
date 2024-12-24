import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://llcccnztkkxlkzblokbt.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxsY2Njbnp0a2t4bGt6Ymxva2J0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjYxNzQ2OTgsImV4cCI6MjA0MTc1MDY5OH0.Fgq-wx04VugAegPGuiBjd25h1SmZMqThXU_4H5qjGTw";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
