CREATE TABLE Reference.reference_index (
    reference_group_id BIGINT REFERENCES Reference.reference_group(id),
    reference_id BIGINT REFERENCES Reference.reference(id),
    PRIMARY KEY (reference_group_id, reference_id)
);