import json
import sys

transcript_path = r"C:\Users\XPS\.gemini\antigravity\brain\85fa5643-0e47-4946-b3df-7965a80b5b07\.system_generated\logs\transcript_full.jsonl"
target_time = "2026-06-20T12:29:00Z"

files = {}

with open(transcript_path, 'r', encoding='utf-8') as f:
    for line in f:
        try:
            data = json.loads(line)
            # Only process up to the target time
            if data.get('created_at', '') > target_time:
                break
            
            if data.get('type') == 'PLANNER_RESPONSE' and 'tool_calls' in data:
                for tool in data['tool_calls']:
                    if tool['name'] == 'write_to_file':
                        try:
                            # It could be named TargetFile
                            path = tool['args'].get('TargetFile', '')
                            content = tool['args'].get('CodeContent', '')
                            if path and content:
                                files[path] = content
                        except Exception:
                            pass
                    elif tool['name'] == 'replace_file_content' or tool['name'] == 'multi_replace_file_content':
                        # It's harder to apply diffs without the actual file state,
                        # but often I just rewrite the whole file or we can see if write_to_file was used.
                        pass
        except Exception:
            pass

# Write out what files we collected
for path, content in files.items():
    print(f"Found file: {path} (length: {len(content)})")
    # Clean the path
    clean_path = path.replace('"', '').strip()
    if 'src\\App.jsx' in clean_path or 'src/App.jsx' in clean_path:
        with open('extracted_App.jsx', 'w', encoding='utf-8') as out:
            out.write(content)
    if 'styles.css' in clean_path:
        with open('extracted_styles.css', 'w', encoding='utf-8') as out:
            out.write(content)
    if 'api.js' in clean_path:
        with open('extracted_api.js', 'w', encoding='utf-8') as out:
            out.write(content)
    if 'main.jsx' in clean_path:
        with open('extracted_main.jsx', 'w', encoding='utf-8') as out:
            out.write(content)
    if 'index.html' in clean_path:
        with open('extracted_index.html', 'w', encoding='utf-8') as out:
            out.write(content)
