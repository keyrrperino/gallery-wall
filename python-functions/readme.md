add to .zshrc
alias python=python3.11
alias pip=pip3.11

source ~/myenv/bin/activate

uvicorn main:app --host 0.0.0.0 --port 8000

brew install python@3.11

export CLOUDSDK_PYTHON=$(which python3.11)


gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/python-functions

gcloud run deploy python-functions \
  --image gcr.io/YOUR_PROJECT_ID/python-functions \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated

gcloud run services update python-functions \
  --update-env-vars SUPABASE_KEY=your_key_here,SUPABASE_URL=your_url_here