from django.shortcuts import render, HttpResponse
from requests import request, ConnectionError
import json


FTP_DIR = 'http://m106.nthu.edu.tw/~s106062341/morpheme_finder_data/'
def get_file(filename, callback):
    try:
        res = request('GET', FTP_DIR + filename)
        res.encoding = 'Big5'
        return callback(res.text)
    except ConnectionError:
        print('HTTP connection failed')
        return False
    except Exception as e:
        print(e)
        print('here')
        return False


def parse_json(content):
    return json.loads(content)


def get_content(content):
    return content


p_root_dict = get_file('morphemes.probability.json', parse_json)
com_rule = get_file('combination.rule.json', parse_json)
suffix = get_file('suffixes.txt', get_content)
prefix = get_file('prefixes.txt', get_content)
if not (p_root_dict and com_rule and suffix and prefix):
    exit(code='Loading files failed.')

suffix_1 = [s.strip("\n").split(", ") for s in suffix]
suffix_list = [s.strip("-") for l in suffix_1 for s in l]

prefix_1 = [s.strip("\n").split(", ") for s in prefix]
prefix_list = [s.strip("-") for l in prefix_1 for s in l]


def Morpheme(word):
    morpheme_list = Segment(word)
    return morpheme_list


def Segment(word):
    if len(word) == 0:
        return []
    candidates = []
    for first, rem in Splits(word):
        candidates.append([first] + Segment(rem))

        # find original form
        for first2, rem2 in Restore_forms(first, rem):
            # mark of raising probability
            candidates.append([first2, 10] + Segment(rem2))

    # assign probabilities
    prob_candidates = []
    for segment_combination in candidates:

        if [word] in candidates:
            prob_sum = Prob_position(segment_combination)
        else:
            prob_sum = Probability(segment_combination)
        prob_candidates.append(prob_sum)
    max_prob = max(prob_candidates)
    i = prob_candidates.index(max_prob)
    seg_result = [s for s in candidates[i] if s != 10]
    return seg_result


def Splits(word):
    possible_splits = [(word[:i + 1], word[i + 1:]) for i in range(len(word))]
    return possible_splits


def Restore_forms(first, rem):
    possible_forms = []
    for affix in com_rule:
        if affix == rem:
            if len(first) >= 2:
                # consider y and er
                if affix == "y" or affix == "er":
                    for l in com_rule[affix]:
                        if l[0] != "" and l[1] == "":
                            if first[-2] == l[0] and first[-1] == l[0]:
                                if l[0] == "":
                                    first_new = first + l[1]
                                else:
                                    if first[-1] == l[0]:
                                        first_new = first.strip(first[-1]) + l[1]
                                    else:
                                        continue
                                possible_forms.append([first_new, rem])
                        else:
                            if l[0] == "":
                                first_new = first + l[1]
                            else:
                                if first[-1] == l[0]:
                                    first_new = first.strip(first[-1]) + l[1]
                                else:
                                    continue
                            possible_forms.append([first_new, rem])
                else:
                    for l in com_rule[affix]:
                        if l[0] == "":
                            first_new = first + l[1]
                        else:
                            if first[-1] == l[0]:
                                first_new = first.strip(first[-1]) + l[1]
                            else:
                                continue
                        possible_forms.append([first_new, rem])
    return possible_forms


def Probability(segment_combination):
    prob_product = 1
    for seg in segment_combination:
        if seg == 10:
            continue
        if seg in p_root_dict:
            # for segments restored by combination rules, give them higher probabilities
            index = segment_combination.index(seg)
            if index < len(segment_combination) - 1:
                latter = segment_combination[index + 1]
                if latter == 10 and len(seg) >= 3:
                    prob = p_root_dict[seg] * 10
                else:
                    prob = p_root_dict[seg]
            else:
                prob = p_root_dict[seg]

        else:
            prob = P_long_word(seg)
        prob_product *= prob
    return prob_product


# the probability of a segmentation with considering positions
def Prob_position(segment_combination):
    prob_product = 1
    for seg in segment_combination:
        div = (segment_combination.index(seg) + 1) / (len(segment_combination) + 1)
        if seg == 10:
            continue
        if seg in p_root_dict:
            # for segments restored by combination rules, give them higher probabilities
            index = segment_combination.index(seg)
            if index < len(segment_combination) - 1:
                latter = segment_combination[index + 1]
                if latter == 10 and len(seg) >= 3:
                    prob = p_root_dict[seg]
                else:
                    prob = p_root_dict[seg]
            else:
                prob = p_root_dict[seg]
        else:
            if len(seg) == 1:
                prob = 0
            else:
                prob = P_long_word(seg)

        # consider the position of suffixes and prefixes
        if seg in prefix_list:
            if div >= 0.5:
                prob *= 0.1
            else:
                prob *= 10
        elif seg in suffix_list:
            if div <= 0.5:
                prob *= 0.1
            else:
                prob *= 10
        prob_product *= prob
    return prob_product


def P_long_word(segment):
    root_list = [root for root in p_root_dict]
    prob = (1 / len(root_list)) * 0.1 ** len(segment)
    return prob


def query(request):
    word = request.GET['word']
    return HttpResponse(content=' '.join(Morpheme(word)))


def index(request):
    return render(request, 'index.html')
