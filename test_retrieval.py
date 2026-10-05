import re

def expand_keywords(question, expanded_text):
    stopwords = {"what", "when", "where", "which", "who", "whom", "whose", "why", "how", "this", "that", "these", "those", "have", "with", "from", "about", "could", "would", "should", "does", "did", "their", "there", "is", "are", "was", "were", "the", "and"}
    all_words_text = question + " " + expanded_text
    words = re.findall(r'\b[a-zA-Z]{3,}\b', all_words_text.lower())
    keywords = set(w for w in words if w not in stopwords)
    return keywords

q1 = "What payment provider did we choose?"
expanded1 = "gateway, stripe, paypal, processor, transaction, billing"
print(expand_keywords(q1, expanded1))
