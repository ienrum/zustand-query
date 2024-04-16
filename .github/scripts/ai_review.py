import os
import sys
import requests
from openai import OpenAI

client = OpenAI()

# OpenAI API를 호출하는 함수
def get_ai_review(text):
  completion = client.chat.completions.create(
    model="gpt-4",
    messages=[
      {"role": "system", "content": "You are a code review assistant, skilled in providing constructive feedback on code changes."},
      {"role": "user", "content": text}
    ]
  )

  return completion.choices[0].message

# GitHub API를 통해 PR에서 코드 변경 사항 가져오기
def fetch_pr_code_changes(repo, pr_number):
    github_token = os.getenv('GITHUB_TOKEN')
    headers = {
        "Authorization": f"Bearer {github_token}",
        "Accept": "application/vnd.github.v3+json"
    }
    url = f"https://api.github.com/repos/{repo}/pulls/{pr_number}/files"
    response = requests.get(url, headers=headers)
    file_changes = response.json()
    code_snippets = []

    for file in file_changes:
        # 각 파일의 변경된 내용을 저장
        if file['status'] != 'removed':  # 삭제된 파일은 제외
            code_snippets.append(file['patch'])
    
    return '\n'.join(code_snippets)

# GitHub PR에 리뷰 코멘트 게시
def post_review_to_github(repo, pr_number, review):
    github_token = os.getenv('GITHUB_TOKEN')
    headers = {
        "Authorization": f"Bearer {github_token}",
        "Accept": "application/vnd.github.v3+json"
    }
    url = f"https://api.github.com/repos/{repo}/issues/{pr_number}/comments"
    response = requests.post(url, headers=headers, json={"body": review})
    return response.status_code

# 메인 로직
if __name__ == "__main__":
    repo = 'ienrum/zustand-query'  # 사용자 이름과 리포지토리 이름 설정
    pr_number = sys.argv[1]  # PR 번호를 명령줄 인수로부터 받아옵니다.
    code_changes = fetch_pr_code_changes(repo, pr_number)
    if code_changes:
        review = get_ai_review(code_changes)
        result = post_review_to_github(repo, pr_number, review)
        print(f'Review posted to GitHub PR: {result}')
    else:
        print('No code changes to review')