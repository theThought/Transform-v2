export const StackHtml = () => `
<div class="l-stack">
    <p>Child item of "stack" parent. It doesn't have a <code>margin-block-end</code>. Instead, the stack parent adds <code>margin-block-start</code> to all adjacent siblings.</p>
    <div class="l-stack" style="background: #eee; padding: 1rem;">
        <p>This <code>&lt;div&gt;</code> is a child item of "stack" parent...</p>
        <p>It is also a "stack" parent in its own right.</p>
    </div>
    <ul>
        <li>This <code>&lt;ul&gt;</code> is a child item of "stack" parent...</li>
        <li>This <code>&lt;ul&gt;</code> is a child item of "stack" parent...</li>
        <li>This <code>&lt;ul&gt;</code> is a child item of "stack" parent...</li>
    </ul>
</div>
`;
