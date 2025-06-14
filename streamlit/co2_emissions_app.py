import streamlit as st
import pandas as pd
import altair as alt

st.title("Monthly CO₂ Emissions")

uploaded_file = st.file_uploader("Upload Excel file", type=["xlsx", "xls"]) 
if uploaded_file:
    data = uploaded_file.read()
    df = pd.read_excel(data)
    if 'Date' not in df.columns or 'CO2' not in df.columns:
        st.error("Excel must contain 'Date' and 'CO2' columns")
    else:
        df['Date'] = pd.to_datetime(df['Date'])
        monthly = df.resample('M', on='Date').sum()
        chart = alt.Chart(monthly.reset_index()).mark_line().encode(
            x=alt.X('Date:T', title='Month'),
            y=alt.Y('CO2:Q', title='CO₂ Emissions')
        )
        st.altair_chart(chart, use_container_width=True)
        st.download_button(
            label="Download uploaded data",
            data=data,
            file_name=uploaded_file.name,
            mime='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        )
else:
    st.write("Please upload an Excel file containing 'Date' and 'CO2' columns.")
