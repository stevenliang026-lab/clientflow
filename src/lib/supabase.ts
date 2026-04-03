import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://bkuftdpykibmkvezgzjh.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJrdWZ0ZHB5a2libWt2ZXpnempoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUwNzIxNzMsImV4cCI6MjA5MDY0ODE3M30.uuSXIpsWYbTzJPdzarirq0_PBKedcZaxz6a_87ntE-A";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
