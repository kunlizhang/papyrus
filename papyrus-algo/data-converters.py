import numpy as np
import pandas as pd

def convert_user_data(input_path, output_path=None):
    """
    Creates a file with only train data

    input_path: path to the input file
    output_path: path to the output file

    Returns: df of the converted data format
    """
    TAB = "#TAB#"
    NLINE = "#N#"

    def get_pos_impre(impressions, pos=True):
        return [item.split("-")[0].strip("N") for item in impressions.split(" ") if item.endswith("-1" if pos else "-0")]

    def combine_impre(row):
        combined = ""
        combined += " ".join(row['pos_impre'])
        combined += TAB
        combined += " ".join(row['neg_impre'])
        combined += TAB
        combined += row['time']
        return combined

    def join_impre(series):
        return pd.Series({"all_impre": NLINE.join(x for x in series)})

    raw_df = pd.read_csv(input_path, sep='\t', header=None)
    raw_df.columns = ['impre_id', 'user_id', 'time', 'history', 'impressions']

    raw_df['pos_impre'] = raw_df['impressions'].apply(get_pos_impre)
    raw_df['neg_impre'] = raw_df['impressions'].apply(get_pos_impre, pos=False)
    raw_df['all_impre'] = raw_df.apply(combine_impre, axis=1)


    grouped_df = raw_df.groupby('user_id', as_index=False).agg({'all_impre': join_impre})
    grouped_df['type'] = "M"

    result_df = grouped_df[["user_id", "type", "all_impre"]]

    if output_path:
        result_df.to_csv(output_path, sep='\t', index=False, header=False)
    
    return result_df 