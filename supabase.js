import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://ruwlqpjeheuglcjyrynq.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ1d2xxcGplaGV1Z2xjanlyeW5xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEwNjMzNDAsImV4cCI6MjA1NjYzOTM0MH0.Qy_6upg_GzO0eAOtI7bHI1h50OdhYSGNJvSuGkvVvYo";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
