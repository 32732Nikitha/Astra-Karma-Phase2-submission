import os

def dump_files(base_dir=".", output_file="dump.txt"):
    skip_dirs = {"node_modules", "lib", ".next"}

    with open(output_file, "w", encoding="utf-8") as out:
        for root, dirs, files in os.walk(base_dir):
            # Skip unwanted directories
            dirs[:] = [d for d in dirs if d not in skip_dirs]

            for file in files:
                file_path = os.path.join(root, file)

                try:
                    with open(file_path, "r", encoding="utf-8") as f:
                        content = f.read()

                    rel_path = os.path.relpath(file_path, base_dir)

                    # Write to file instead of printing
                    out.write(f"{rel_path}:{content}\n\n")

                except Exception:
                    continue


if __name__ == "__main__":
    dump_files()