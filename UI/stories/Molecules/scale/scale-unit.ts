export const ScaleUnitHtml = (args): string => `
<m-scale-unit data-value="1" style="background-position-x: 0;">
    <span class="a-label" data-value="${args.dataValue}">${args.dataValue}</span>
</m-scale-unit>
`;
