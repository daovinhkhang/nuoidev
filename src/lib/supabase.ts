
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wdzbquldinmecfihunpl.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndkemJxdWxkaW5tZWNmaWh1bnBsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU0MTU3NTEsImV4cCI6MjA4MDk5MTc1MX0.EVTOR97Se-mz-0RLEZj9KMBb5I-3M6vIXnczVO0-JZE';

export const supabase = createClient(supabaseUrl, supabaseKey);
