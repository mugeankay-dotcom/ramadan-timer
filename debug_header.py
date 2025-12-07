
def check_header(file_path):
    try:
        with open(file_path, 'rb') as f:
            data = f.read(10)
            print(f"{file_path}: {data}")
    except Exception as e:
        print(e)

check_header('screenshots/mobile.png')
check_header('screenshots/desktop.png')
