import { createClient } from "@supabase/supabase-js";

const url = "https://kxddoxahaokfsmmfoumg.supabase.co";
const key =
	"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt4ZGRveGFoYW9rZnNtbWZvdW1nIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTkyMDQ0NjEsImV4cCI6MjAxNDc4MDQ2MX0.r0Duu7aSAtmSVKdyQDYKhwIqDcPwNyIlb6Kyyoazw_U";
const clientDB = createClient(url, key);

export default clientDB;
